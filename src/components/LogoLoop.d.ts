import { ComponentType, CSSProperties, ReactNode } from 'react';

export interface LogoLoopProps {
    logos: (string | { src: string;[key: string]: any } | { node: ReactNode;[key: string]: any })[];
    speed?: number;
    direction?: 'left' | 'right' | 'up' | 'down';
    width?: string | number;
    logoHeight?: number;
    gap?: number;
    pauseOnHover?: boolean;
    hoverSpeed?: number;
    fadeOut?: boolean;
    fadeOutColor?: string;
    scaleOnHover?: boolean;
    renderItem?: (item: any, key: any) => ReactNode;
    ariaLabel?: string;
    className?: string;
    style?: CSSProperties;
}

declare const LogoLoop: ComponentType<LogoLoopProps>;

export default LogoLoop;
