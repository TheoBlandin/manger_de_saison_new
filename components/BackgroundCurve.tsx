import { Colors } from "@/constants/Colors";
import React from "react";
import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

export default function BackgroundCurve({ height = 85, curveDepth = 25 }) {
  const d = `
    M 0 0
    L ${width} 0
    L ${width} ${height - curveDepth}
    Q ${width / 2} ${height} 0 ${height - curveDepth}
    Z
  `;

  return (
    <Svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Path d={d} fill={Colors.primary} />
    </Svg>
  );
}
