import React, { ReactNode } from 'react';
import './WidgetWindow.css'

type WidgetWindowProps = {
  children: ReactNode;
}

export function WidgetWindow({ children }: WidgetWindowProps) {
  return (
    <div className='widget-window'>
      {children}
    </div>
  )
}