import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeContext } from '../../theme';

interface VerseBracketProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
}

const VerseBracket: React.FC<VerseBracketProps> = ({
  width = 16,
  height = 48,
  strokeWidth = 2,
}) => {
  const { theme } = useThemeContext();

  return (
    <View style={{ marginRight: 8, justifyContent: 'center' }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={`M ${width - 2} 2 L 2 2 L 2 ${height - 2} L ${width - 2} ${height - 2}`}
          stroke={theme.colors.accent}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default VerseBracket;
