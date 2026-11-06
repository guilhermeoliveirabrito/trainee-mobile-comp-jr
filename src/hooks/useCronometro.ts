import { useCallback, useEffect, useRef, useState } from 'react';

export type EstadoCronometro = 'parado' | 'rodando' | 'pausado' | 'concluido';

export function useCronometro(
  totalSegundos: number,
  aoTerminar: (segundos: number) => void
) {
  const [estado, setEstado] = useState<EstadoCronometro>('parado');
  const [acumuladoMs, setAcumuladoMs] = useState(0);
  const [inicioMs, setInicioMs] = useState(0);
  const [agoraMs, setAgoraMs] = useState(0);
  const aoTerminarRef = useRef(aoTerminar);

  useEffect(() => {
    aoTerminarRef.current = aoTerminar;
  }, [aoTerminar]);

  useEffect(() => {
    if (estado !== 'rodando') return;

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

  const iniciar = useCallback(() => {
    const agora = Date.now();
    setInicioMs(agora);
    setAgoraMs(agora);
    setEstado('rodando');
  }, []);

  const pausar = useCallback(() => {
    if (estado !== 'rodando') return;
    setAcumuladoMs(acumuladoMs + (Date.now() - inicioMs));
    setEstado('pausado');
  }, [estado, acumuladoMs, inicioMs]);

  const reiniciar = useCallback(() => {
    setAcumuladoMs(0);
    setEstado('parado');
  }, []);

  return { estado, restanteSegundos, decorridoSegundos, iniciar, pausar, reiniciar };
}