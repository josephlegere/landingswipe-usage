import React, { ReactElement, ReactNode } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import PropTypes from 'prop-types';

import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedProps,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import MaskedView from "@react-native-community/masked-view";
import { Vector } from "react-native-redash";

import { SlideProps } from "./Slide";

export const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
export const MIN_LEDGE = 50;
export const MARGIN_WIDTH = MIN_LEDGE + 50;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export var Side;
((Side) => {
    Side[Side["LEFT"] = 0] = "LEFT";
    Side[Side["RIGHT"] = 1] = "RIGHT";
    Side[Side["NONE"] = 2] = "NONE";
})(Side || (Side = {}));

const Wave = ({ side, position: { x, y }, children, isTransitioning }) => {
    const animatedProps = useAnimatedProps(() => {

        const p0 = { x: HEIGHT - MIN_LEDGE, y: 0 };
        return {
            d: [
                `M 0 ${HEIGHT}`,
                `H ${WIDTH}`,
                `V ${y.value}`,
                `H 0`,
                `Z`,
            ].join(" "),
        };
    });
    const maskElement = (
        <Svg
            style={[
                StyleSheet.absoluteFill,
                {
                    // transform: [{ rotateY: side === Side.RIGHT ? "180deg" : "0deg" }],
                },
            ]}
        >
            <AnimatedPath
                fill={Platform.OS === "android" ? children.props.slide.color : "black"}
                animatedProps={animatedProps}
            />
        </Svg>
    );
    return (
        <MaskedView style={StyleSheet.absoluteFill} maskElement={maskElement}>
            {children}
        </MaskedView>
    );
};

Wave.propType = {
    // side: Side,
    // position: Vector,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    // isTransitioning: Animated.SharedValue
}

export default Wave;