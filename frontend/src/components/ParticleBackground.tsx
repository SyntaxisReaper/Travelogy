import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
import Particles from 'react-particles';
import { colors } from '../styles/techTheme';

const ParticleBackgroundBase: React.FC = () => {
  const [lowPerformance, setLowPerformance] = useState(false);
  
  useEffect(() => {
    // Simple performance check
    const checkPerformance = () => {
      const start = performance.now();
      const iterations = 100000;
      for (let i = 0; i < iterations; i++) {
        Math.random() * Math.random();
      }
      const duration = performance.now() - start;
      if (duration > 10) { // If simple calc takes more than 10ms, reduce effects
        setLowPerformance(true);
      }
    };
    
    checkPerformance();
  }, []);
  
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = useMemo(() => ({
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: lowPerformance ? 15 : 30,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push',
        },
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: [colors.neonCyan, colors.neonPink, colors.neonGreen, colors.neonBlue],
      },
      links: {
        color: colors.neonCyan,
        distance: 100,
        enable: true,
        opacity: 0.15,
        width: 1,
        triangles: {
          enable: false,
        },
      },
      collisions: {
        enable: false,
      },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: {
          default: 'bounce' as const,
        },
        random: false,
        speed: 0.3,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: lowPerformance ? 10 : 20,
      },
      opacity: {
        value: 0.5,
        opacity: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.1,
        },
      },
      shape: {
        type: ['circle', 'triangle', 'polygon'],
        options: {
          polygon: {
            nb_sides: 6,
          },
        },
      },
      size: {
        value: { min: 1, max: 5 },
        animation: {
          enable: true,
          speed: 1,
          size_min: 0.5,
        },
      },
    },
    detectRetina: true,
  }), []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesOptions}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

const ParticleBackground: React.FC = React.memo(ParticleBackgroundBase);
ParticleBackground.displayName = 'ParticleBackground';

export default ParticleBackground;
