import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import styled from 'styled-components/native';
import { colors } from '../theme/colors';

interface LoadingIndicatorProps {
  color?: 'green' | 'red' | 'primary' | string;
  size?: number;
}

const Container = styled.View<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  justify-content: center;
  align-items: center;
`;

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Animated SVG Spinner faithful to assets/spinner_green.svg & spinner_red.svg
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  color = 'green',
  size = 28,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const strokeColor =
    color === 'green'
      ? colors.bookGreen
      : color === 'red'
      ? colors.cancelRed
      : color === 'primary'
      ? colors.primary
      : color;

  return (
    <Container size={size}>
      <AnimatedView style={{ transform: [{ rotate: spin }] }}>
        <Svg width={size} height={size} viewBox="0 0 38 38">
          <G fill="none" fillRule="evenodd" transform="translate(1 1)">
            {/* Background faint track circle */}
            <Circle
              cx={18}
              cy={18}
              r={18}
              stroke={strokeColor}
              strokeWidth={2.5}
              strokeOpacity={0.25}
            />
            {/* Rotating 90-degree arc matching Sam Herbert spinner SVG */}
            <Path
              d="M36 18c0-9.94-8.06-18-18-18"
              stroke={strokeColor}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </AnimatedView>
    </Container>
  );
};
