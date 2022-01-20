import React, { ReactElement, useEffect } from "react";
import { StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { snapPoint, useVector } from "react-native-redash";

import Wave, { HEIGHT, MARGIN_WIDTH, Side, WIDTH } from "./Wave";
import Button from "./Button";
import { SlideProps } from "./Slide";

const Slider = ({ index, children: current, prev, next, setIndex }) => {

    const zIndex = useSharedValue(0);
    const bottom = useVector();
    const isBelow = useSharedValue(true);

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: ({ x, y }) => {
            console.log(x);
            console.log(y);
            zIndex.value = 100;
        },
        onActive: ({ x, y }) => {
            bottom.x.value = x;
            bottom.y.value = y;
        },
        onEnd: ({ velocityX, velocityY, y }) => {
            let snapPoints;
            
            if (isBelow.value) snapPoints = [HEIGHT - MARGIN_WIDTH];
            else snapPoints = [MARGIN_WIDTH];
            
            const dest = snapPoint(y, velocityY, snapPoints);

                bottom.y.value = withSpring(
                    HEIGHT - dest,
                    { velocity: velocityY },
                    () => {
                        console.log(bottom);

                        if (isBelow.value) isBelow.value = false;
                        else isBelow.value = true;
                    });
        },
    });

    const leftStyle = useAnimatedStyle(() => ({
        zIndex: zIndex.value,
    }));

    useEffect(() => {
        bottom.y.value = withSpring(HEIGHT - MARGIN_WIDTH);
    }, [bottom]);

    return (
        <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View style={StyleSheet.absoluteFill}>
                {current}
                {/* {prev && ( */}
                    <Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
                        <Wave
                            position={bottom}
                            side={Side.LEFT}
                            // isTransitioning={isTransitioningLeft}
                        >
                            {prev}
                        </Wave>
                        {/* <Button position={left} side={Side.LEFT} activeSide={activeSide} /> */}
                    </Animated.View>
                {/* )} */}
            </Animated.View>
        </PanGestureHandler>
    );
};

export default Slider;
