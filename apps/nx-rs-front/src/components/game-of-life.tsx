import { FC, useCallback, useEffect, useRef } from 'react';
import { Cell, Universe } from '../../../../libs/lib-rs/pkg';
import { memory } from '../../../../libs/lib-rs/pkg/calc_rs_bg.wasm';

const CELL_SIZE = 1; // px

const GameOfLife: FC = () => {
  const universe = Universe.new(500, 500);
  const width = universe.width();
  const height = universe.height();
  const canvasRef = useRef(null);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.strokeStyle = '#000000';

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
  }, [height, width]);

  const getIndex = useCallback((row: number, column: number): number => {
    return row * width + column;
  }, [width]);

  const drawCells = useCallback((ctx: CanvasRenderingContext2D) => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col);

        ctx.fillStyle = cells[idx] === Cell.Dead
          ? '#FFFFFF'
          : '#000000';

        ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    ctx.stroke();
  }, [getIndex, height, universe, width]);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext('2d');
    let frameCount = 0;
    let animationFrameId: any;

    const draw = (ctx: any, frameCount: any) => {
      universe.tick();
      drawGrid(ctx);
      drawCells(ctx);
    };

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      setTimeout(() => {
        animationFrameId = window.requestAnimationFrame(render);
      }, 10);
    };
    render();

    return () => {
      // window.cancelAnimationFrame(animationFrameId);
    };
  });


  return (
    <div style={{ padding: '10px', width: '100%' }}>
      <h4>Game of life</h4>
      <div style={{ height: '10px' }}/>
      <canvas style={{ width: '100%', height: '100%' }} ref={canvasRef}/>
    </div>
  );
};

export default GameOfLife;
