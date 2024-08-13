### Noties

----Lastly i want to implement the Try me preview by setting the an onclick mode by firing the the function from parent compontent App.js WebgiViewer.

import React, {
useRef,
useState,
useCallback,
forwardRef,
useImperativeHandle,
useEffect
} from 'react'
import {
ViewerApp,
AssetManagerPlugin,
GBufferPlugin,
ProgressivePlugin,
TonemapPlugin,
SSRPlugin,
SSAOPlugin,
BloomPlugin,
GammaCorrectionPlugin,
mobileAndTabletCheck,

} from "webgi";

//step 14 to animate all of the i have to use the gsap functon
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
// step 15 after creting the scroll animation in my jsx then render the function by calling the functions
import { scrollAnimation } from "../lib/scroll-animation"

gsap.registerPlugin(ScrollTrigger)

const WebgiViewer = () => {
// step 1
const canvasRef = useRef(null)

    // step 16 rendering the unction of the Animation
    const memoizedScrollAnimation = useCallback(
        (position, target, onUpdate) => {
            if (position && target && onUpdate) {
                scrollAnimation(position, target, onUpdate)
            }

        }, []
    )

    const setupViewer = useCallback(async () => { // step 2 to call all the functions
        //step 3 Initialize the viewer
        const viewer = new ViewerApp({
            canvas: canvasRef.current,
        })

        // step 4
        const manager = await viewer.addPlugin(AssetManagerPlugin)

        //step 11 adding two contom
        const camera = viewer.scene.activeCamera;
        // step 12 after settig the camera i can use this to set the position
        const position = camera.position;
        const target = camera.target;



        // Add plugins individually.
        await viewer.addPlugin(GBufferPlugin);
        await viewer.addPlugin(new ProgressivePlugin(32));
        await viewer.addPlugin(new TonemapPlugin(true));
        await viewer.addPlugin(GammaCorrectionPlugin);
        await viewer.addPlugin(SSRPlugin);
        await viewer.addPlugin(SSAOPlugin);
        await viewer.addPlugin(BloomPlugin);


        viewer.renderer.refreshPipeline();

        //step 5 Import and add a GLB file.
        await manager.addFromPath("scene-black.glb");

        // step 6
        viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

        //step 8 i want to save the control once i load the viewer by seting the camera options the setting it to false. so this means this save the control by using an arrary's for the 3d modle's
        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

        //step 9 when ever i reload the website i want my postion of the website  to be on top
        window.scrollTo(0, 0);

        // step 14 next setting some condition by creating some variable
        let needsUpdate = true;

        // step 16 setting an update for the camera in which the camrea and view need to be updated
        const onUpdate = () => {
            needsUpdate = true;
            viewer.setDirty();
        }
        //step 10 Now I want to add the EventListener to the viewer itself so that it will update the positon of the camera.
        viewer.addEventListener("preFrame", () => {
            //15 setting some condition
            if (needsUpdate) {
                camera.positionTargetUpdated(true);
                needsUpdate = false;

            }
            // step 13
            camera.positionTargetUpdated(true)
        })
        memoizedScrollAnimation(position, target, onUpdate);
    }, []);


    // step 7

    useEffect(() => {
        setupViewer()
    }, [])



    return (
        <div id='webgi-canvas-container'>
            <canvas id='webgi-canvas' ref={canvasRef}></canvas>
        </div>
    )

}

export default WebgiViewer

import React, {
useRef,
useState,
useCallback,
useEffect
} from 'react';
import {
ViewerApp,
AssetManagerPlugin,
GBufferPlugin,
ProgressivePlugin,
TonemapPlugin,
SSRPlugin,
SSAOPlugin,
BloomPlugin,
GammaCorrectionPlugin,
mobileAndTabletCheck,
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimation } from "../lib/scroll-animation";

gsap.registerPlugin(ScrollTrigger);

const WebgiViewer = () => {
const canvasRef = useRef(null);

    const memoizedScrollAnimation = useCallback(
        (position, target, onUpdate) => {
            if (position && target && onUpdate) {
                scrollAnimation(position, target, onUpdate);
            }
        }, []
    );

    const setupViewer = useCallback(async () => {
        const viewer = new ViewerApp({
            canvas: canvasRef.current,
        });

        const manager = await viewer.addPlugin(AssetManagerPlugin);

        const camera = viewer.scene.activeCamera;
        const position = camera.position;
        const target = camera.target;

        await viewer.addPlugin(GBufferPlugin);
        await viewer.addPlugin(new ProgressivePlugin(32));
        await viewer.addPlugin(new TonemapPlugin(true));
        await viewer.addPlugin(GammaCorrectionPlugin);
        await viewer.addPlugin(SSRPlugin);
        await viewer.addPlugin(SSAOPlugin);
        await viewer.addPlugin(BloomPlugin);

        viewer.renderer.refreshPipeline();

        await manager.addFromPath("scene-black.glb");

        viewer.getPlugin(TonemapPlugin).config.clipBackground = true;
        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

        window.scrollTo(0, 0);

        let needsUpdate = true;

        const onUpdate = () => {
            needsUpdate = true;
            viewer.setDirty();
        };

        viewer.addEventListener("preFrame", () => {
            if (needsUpdate) {
                camera.positionTargetUpdated(true);
                needsUpdate = false;
            }
        });

        memoizedScrollAnimation(position, target, onUpdate);
    }, [memoizedScrollAnimation]);

    useEffect(() => {
        setupViewer();
    }, [setupViewer]);

    return (
        <div id='webgi-canvas-container'>
            <canvas id='webgi-canvas' ref={canvasRef}></canvas>
        </div>
    );

}

export default WebgiViewer;

import React, {
useRef,
useState,
useCallback,
useEffect,
forwardRef,
useImperativeHandle
} from 'react';
import {
ViewerApp,
AssetManagerPlugin,
GBufferPlugin,
ProgressivePlugin,
TonemapPlugin,
SSRPlugin,
SSAOPlugin,
BloomPlugin,
GammaCorrectionPlugin,
mobileAndTabletCheck,
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimation } from "../lib/scroll-animation";

gsap.registerPlugin(ScrollTrigger);

const WebgiViewer = forwardRef((props, ref) => {
const canvasRef = useRef(null);
const cambvasContainerRef = useRef(null);
const [viewerRef, setViewerRef] = useState(null);
const [targetRef, setTargetRef] = useState(null);
const [cameraRef, setCameraRef] = useState(null);
const [positionRef, setPositionRef] = useState(null);
const [previewMode, setPreviewMode] = useState(false);
const [isMobile, setIsMobile] = useState(null);

    useImperativeHandle(ref, () => ({
        triggerPreview() {
            setPreviewMode(true);
            cambvasContainerRef.current.style.pointerEvents = "all";
            props.contentRef.current.style.opacity = "0";
            gsap.to(positionRef, {
                x: 13.04,
                y: -2.01,
                z: 2.29,
                duration: 2,
                onUpdate: () => {
                    viewerRef.setDirty();
                    cameraRef.positionTargetUpdated(true);
                }
            });
            gsap.to(targetRef, {
                x: 0.11,
                y: 0.0,
                z: 0.0,
                duration: 2,
            });
            viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: true });
        }
    }));

    const memoizedScrollAnimation = useCallback(
        (position, target, isMobile, onUpdate) => {
            if (position && target && onUpdate) {
                scrollAnimation(position, target, isMobile, onUpdate);
            }
        }, []
    );

    const setupViewer = useCallback(async () => {
        const viewer = new ViewerApp({
            canvas: canvasRef.current,
        });

        setViewerRef(viewer);
        const isMobileOrTablet = mobileAndTabletCheck();
        setIsMobile(isMobileOrTablet);

        const manager = await viewer.addPlugin(AssetManagerPlugin);

        const camera = viewer.scene.activeCamera;
        const position = camera.position;
        const target = camera.target;

        setCameraRef(camera);
        setPositionRef(position);
        setTargetRef(target);

        await viewer.addPlugin(GBufferPlugin);
        await viewer.addPlugin(new ProgressivePlugin(32));
        await viewer.addPlugin(new TonemapPlugin(true));
        await viewer.addPlugin(GammaCorrectionPlugin);
        await viewer.addPlugin(SSRPlugin);
        await viewer.addPlugin(SSAOPlugin);
        await viewer.addPlugin(BloomPlugin);

        viewer.renderer.refreshPipeline();

        await manager.addFromPath("scene-black.glb");

        viewer.getPlugin(TonemapPlugin).config.clipBackground = true;
        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

        if (isMobileOrTablet) {
            position.set(-16.7, 1.17, 11.7);
            target.set(0, 1.37, 0);
            props.contentRef.current.className = "mobile-or-tablet";
        }

        window.scrollTo(0, 0);

        let needsUpdate = true;

        const onUpdate = () => {
            needsUpdate = true;
            viewer.setDirty();
        };

        viewer.addEventListener("preFrame", () => {
            if (needsUpdate) {
                camera.positionTargetUpdated(true);
                needsUpdate = false;
            }
        });

        memoizedScrollAnimation(position, target, isMobileOrTablet, onUpdate);
    }, [memoizedScrollAnimation, props.contentRef]);

    useEffect(() => {
        setupViewer();
    }, [setupViewer]);

    const handleExit = useCallback(() => {
        cambvasContainerRef.current.style.pointerEvents = "none";
        props.contentRef.current.style.opacity = "1";
        viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: false });
        setPreviewMode(false);

        gsap.to(positionRef, {
            x: 1.56,
            y: 5.0,
            z: 0.01,
            scrollTrigger: {
                trigger: ".display-section",
                start: "top bottom",
                end: "top top",
                scrub: 2,
                immediateRender: false,
            },
            onUpdate: () => {
                viewerRef.setDirty();
                cameraRef.positionTargetUpdated(true);
            },
        });
        gsap.to(targetRef, {
            x: -0.55,
            y: 0.32,
            z: 0.0,
            scrollTrigger: {
                trigger: ".display-section",
                start: "top bottom",
                end: "top top",
                scrub: 2,
                immediateRender: false,
            },
        });
    }, [cambvasContainerRef, viewerRef, positionRef, cameraRef, targetRef, props.contentRef]);

    return (
        <div ref={cambvasContainerRef} id='webgi-canvas-container'>
            <canvas id='webgi-canvas' ref={canvasRef}></canvas>
            {
                previewMode && (
                    <button className='button' onClick={handleExit}>Exit</button>
                )
            }
        </div>
    );

});

export default WebgiViewer;
