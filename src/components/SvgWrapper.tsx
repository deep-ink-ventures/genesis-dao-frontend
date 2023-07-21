import type { ComponentType, ReactElement } from 'react';

export interface SvgProps {
  fill?: string;
  stroke?: string;
  width?: number;
  height?: number;
  className?: string;
}

type SvgComponent = (props: SvgProps) => ReactElement;

export const withSvgProps = <P extends SvgProps>(
  WrappedComponent: ComponentType<P>
) => {
  const WithSvgProps = ({
    children,
    ...rest
  }: P & { children?: SvgComponent }): ReactElement => {
    if (typeof children === 'function') {
      return children(rest);
    }

    return <WrappedComponent {...(rest as P)} />;
  };

  const componentName = `WithSvgProps(${
    WrappedComponent.displayName || WrappedComponent.name || 'Svg'
  })`;
  WithSvgProps.displayName = componentName;

  return WithSvgProps;
};
