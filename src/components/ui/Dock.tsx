'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './Dock.css';

export interface DockItemData {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export interface DockProps {
  items: DockItemData[];
  className?: string;
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
}

export function DockIcon({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export function DockItem({
  item,
  mouseX,
  baseItemSize = 34,
  magnification = 48,
  distance = 90,
}: {
  item: DockItemData;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = React.useState(false);

  const distanceFromMouse = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - (rect.x + rect.width / 2);
  });

  const widthSync = useTransform(
    distanceFromMouse,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );

  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={item.onClick}
      className="dock-item relative"
      aria-label={item.label}
      type="button"
    >
      <DockIcon>{item.icon}</DockIcon>
      {hovered && <span className="dock-label">{item.label}</span>}
    </motion.button>
  );
}

export default function Dock({
  items,
  className = '',
  panelHeight = 46,
  baseItemSize = 34,
  magnification = 48,
  distance = 90,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className={`dock-outer ${className}`}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{ height: panelHeight }}
        className="dock-panel"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            item={item}
            mouseX={mouseX}
            baseItemSize={baseItemSize}
            magnification={magnification}
            distance={distance}
          />
        ))}
      </motion.div>
    </div>
  );
}
