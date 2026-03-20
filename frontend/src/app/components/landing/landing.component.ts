import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  private animFrame: number = 0;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private bikes: Bike[] = [];
  private explosions: Explosion[] = [];
  private readonly GRID = 40;
  private readonly SPEED = 2.5;

  ngOnInit(): void {
    setTimeout(() => this.initCanvas(), 50);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrame);
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  private initCanvas(): void {
    this.canvas = document.getElementById('tron-canvas') as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    window.addEventListener('resize', this.onResize);
    this.spawnBikes();
    this.loop();
  }

  private spawnBikes(): void {
    const colors = ['#00eeff', '#ff6600', '#cc00ff', '#00ff88', '#ffcc00', '#ff0066'];
    for (let i = 0; i < 6; i++) {
      this.bikes.push(this.newBike(colors[i]));
    }
  }

  private newBike(color: string): Bike {
    const G = this.GRID;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const dirs: Dir[] = ['right', 'left', 'up', 'down'];
    const dir = dirs[Math.floor(Math.random() * 4)];
    const gx = Math.floor(Math.random() * Math.floor(W / G));
    const gy = Math.floor(Math.random() * Math.floor(H / G));
    const x = gx * G + G / 2;
    const y = gy * G + G / 2;
    return {
      x, y,
      prevX: x, prevY: y,
      targetX: x + this.dv(dir).dx * G,
      targetY: y + this.dv(dir).dy * G,
      progress: 0,
      dir, nextDir: dir,
      color,
      trail: [],
      trailMax: 14 + Math.floor(Math.random() * 10),
      stepsToTurn: this.rnd(4, 9),
      stepCount: 0,
      exploding: false,
    };
  }

  private loop(): void {
    this.update();
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  private update(): void {
    const G = this.GRID;
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (const b of this.bikes) {
      if (b.exploding) continue;

      b.progress += this.SPEED / G;

      if (b.progress >= 1) {
        b.progress = 0;
        b.trail.push({ x: b.targetX, y: b.targetY });
        if (b.trail.length > b.trailMax) b.trail.shift();

        b.prevX = b.targetX;
        b.prevY = b.targetY;
        b.x = b.targetX;
        b.y = b.targetY;
        b.dir = b.nextDir;

        b.stepCount++;
        if (b.stepCount >= b.stepsToTurn) {
          b.stepCount = 0;
          b.stepsToTurn = this.rnd(4, 9);
          b.nextDir = this.pickTurn(b.dir);
        }

        const { dx, dy } = this.dv(b.nextDir);
        b.targetX = b.x + dx * G;
        b.targetY = b.y + dy * G;

        // Verificar colisión con estelas de otras motos
        if (this.checkCollision(b)) {
          this.explode(b);
          continue;
        }

        if (b.targetX < -G || b.targetX > W + G || b.targetY < -G || b.targetY > H + G) {
          const color = b.color;
          Object.assign(b, this.newBike(color));
        }
      }

      b.x = b.prevX + (b.targetX - b.prevX) * b.progress;
      b.y = b.prevY + (b.targetY - b.prevY) * b.progress;
    }

    // Actualizar explosiones
    this.explosions = this.explosions.filter(e => e.life > 0);
    for (const e of this.explosions) {
      e.life -= 1;
      for (const p of e.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.alpha = e.life / e.maxLife;
        p.size *= 0.97;
      }
    }
  }

  private checkCollision(b: Bike): boolean {
    const threshold = this.GRID * 0.4;
    for (const other of this.bikes) {
      if (other === b || other.exploding) continue;
      for (const pt of other.trail) {
        const dx = b.x - pt.x;
        const dy = b.y - pt.y;
        if (Math.sqrt(dx * dx + dy * dy) < threshold) {
          return true;
        }
      }
    }
    return false;
  }

  private explode(b: Bike): void {
    const particles: Particle[] = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 1.5 + Math.random() * 4;
      particles.push({
        x: b.x, y: b.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        size: 2 + Math.random() * 4,
        color: b.color,
      });
    }
    // Añadir algunas partículas blancas del destello
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      particles.push({
        x: b.x, y: b.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        size: 1.5 + Math.random() * 2,
        color: '#ffffff',
      });
    }

    this.explosions.push({ x: b.x, y: b.y, particles, life: 50, maxLife: 50, color: b.color });

    // Renacer después de un delay
    b.exploding = true;
    b.trail = [];
    setTimeout(() => {
      const color = b.color;
      Object.assign(b, this.newBike(color));
    }, 800);
  }

  private draw(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar estelas
    for (const b of this.bikes) {
      if (b.exploding) continue;
      const fullTrail = [...b.trail, { x: b.x, y: b.y }];
      if (fullTrail.length < 2) continue;

      for (let i = 1; i < fullTrail.length; i++) {
        const t = i / fullTrail.length;
        ctx.beginPath();
        ctx.moveTo(fullTrail[i - 1].x, fullTrail[i - 1].y);
        ctx.lineTo(fullTrail[i].x, fullTrail[i].y);
        ctx.strokeStyle = this.rgba(b.color, t * 0.85);
        ctx.lineWidth = 1 + t * 2.5;
        ctx.lineCap = 'square';
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6 + t * 10;
        ctx.stroke();
      }

      // Cabeza
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 24;
      ctx.fill();

      // Halo
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = this.rgba(b.color, 0.3);
      ctx.shadowBlur = 0;
      ctx.fill();
    }

    // Dibujar explosiones
    for (const e of this.explosions) {
      const t = e.life / e.maxLife;

      // Flash central
      if (t > 0.7) {
        const flashAlpha = (t - 0.7) / 0.3;
        ctx.beginPath();
        ctx.arc(e.x, e.y, (1 - t) * 60, 0, Math.PI * 2);
        ctx.fillStyle = this.rgba('#ffffff', flashAlpha * 0.6);
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 40;
        ctx.fill();
      }

      // Anillo expansivo
      ctx.beginPath();
      ctx.arc(e.x, e.y, (1 - t) * 80, 0, Math.PI * 2);
      ctx.strokeStyle = this.rgba(e.color, t * 0.5);
      ctx.lineWidth = 2;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 15;
      ctx.stroke();

      // Partículas
      for (const p of e.particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = this.rgba(p.color, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
    }

    ctx.shadowBlur = 0;
  }

  private pickTurn(dir: Dir): Dir {
    const opts: Record<Dir, Dir[]> = {
      right: ['up', 'down'],
      left:  ['up', 'down'],
      up:    ['left', 'right'],
      down:  ['left', 'right'],
    };
    return opts[dir][Math.floor(Math.random() * 2)];
  }

  private dv(dir: Dir): { dx: number; dy: number } {
    return { right:{dx:1,dy:0}, left:{dx:-1,dy:0}, up:{dx:0,dy:-1}, down:{dx:0,dy:1} }[dir];
  }

  private rgba(hex: string, a: number): string {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${Math.max(0,Math.min(1,a))})`;
  }

  private rnd(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min + 1));
  }
}

type Dir = 'right' | 'left' | 'up' | 'down';

interface Bike {
  x: number; y: number;
  prevX: number; prevY: number;
  targetX: number; targetY: number;
  progress: number;
  dir: Dir; nextDir: Dir;
  color: string;
  trail: { x: number; y: number }[];
  trailMax: number;
  stepsToTurn: number;
  stepCount: number;
  exploding: boolean;
}

interface Explosion {
  x: number; y: number;
  particles: Particle[];
  life: number;
  maxLife: number;
  color: string;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number;
  size: number;
  color: string;
}