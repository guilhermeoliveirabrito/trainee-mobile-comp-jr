import { useCallback, useEffect, useRef, useState } from 'react';

export type EstadoCronometro = 'parado' | 'rodando' | 'pausado' | 'concluido';

export function useCronometro(
  totalSegundos: number,
  aoTerminar: (segundos: number) => void
) {
  const [estado, setEstado] = useState<EstadoCronometro>('parado');
  // O que já passou antes da última pausa
  const [acumuladoMs, setAcumuladoMs] = useState(0);
  const [inicioMs, setInicioMs] = useState(0);
  const [agoraMs, setAgoraMs] = useState(0);
  const aoTerminarRef = useRef(aoTerminar);

  // Guarda sempre a função mais nova, sem mexer no intervalo
  useEffect(() => {
    aoTerminarRef.current = aoTerminar;
  }, [aoTerminar]);

  useEffect(() => {
    if (estado !== 'rodando') return;

    // Confere o relógio do aparelho a cada tick, contar segundo a segundo atrasa
    const intervalo = setInterval(() => {
      const agora = Date.now();
      setAgoraMs(agora);

      if (acumuladoMs + (agora - inicioMs) >= totalSegundos * 1000) {
        clearInterval(intervalo);
        setAcumuladoMs(totalSegundos * 1000);
        setEstado('concluido');
        aoTerminarRef.current(totalSegundos);
      }
    }, 250);

    return () => clearInterval(intervalo);
  }, [estado, acumuladoMs, inicioMs, totalSegundos]);

  const decorridoMs =
    acumuladoMs + (estado === 'rodando' ? Math.max(0, agoraMs - inicioMs) : 0);
  const decorridoSegundos = Math.min(totalSegundos, Math.floor(decorridoMs / 1000));
  const restanteSegundos = Math.max(0, totalSegundos - decorridoSegundos);

  // Serve pra iniciar e pra retomar, o acumulado fica guardado
  const iniciar = useCallback(() => {
    const agora = Date.now();
    setInicioMs(agora);
    setAgoraMs(agora);
    setEstado('rodando');
  }, []);

  const pausar = useCallback(() => {
    if (estado !== 'rodando') return;
    // Soma o trecho que acabou de rodar
    setAcumuladoMs(acumuladoMs + (Date.now() - inicioMs));
    setEstado('pausado');
  }, [estado, acumuladoMs, inicioMs]);

  const reiniciar = useCallback(() => {
    setAcumuladoMs(0);
    setEstado('parado');
  }, []);

  return { estado, restanteSegundos, decorridoSegundos, iniciar, pausar, reiniciar };
}