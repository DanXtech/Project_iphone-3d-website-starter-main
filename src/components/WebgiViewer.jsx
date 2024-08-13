import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect } from "react";
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
    mobileAndTabletCheck
} from "webgi";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { scrollAnimation } from "../lib/scroll-animation"


gsap.registerPlugin(ScrollTrigger);


const WebgiViewer = forwardRef((props, ref) => {


    const canvasRef = useRef(null);
    const [viewerRef, setViewerRef] = useState(null)
    const [targetRef, setTargetRef] = useState(null)
    const [cameraRef, setCameraRef] = useState(null)
    const [positionRef, setPositionRef] = useState(null)

    // setting a state a the preview mode
    const [previewMode, setPreviewMode] = useState(false)

    // For mobileAndTabletCheck
    const [isMobile, setIsMobile] = useState(null)

    const canbvasContainerRef = useRef(null)

    useImperativeHandle(ref, () => ({
        triggerPreview() {
            // setting the previewMode to be true
            setPreviewMode(true)
            canbvasContainerRef.current.style.pointerEvents = "all";
            props.contentRef.current.style.opacity = "0";
            gsap.to(positionRef, {
                x: 13.04,
                y: -2.01,
                z: 2.29,
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


            gsap.to(targetRef, { x: 0.11, y: 0.0, z: 0.0, duration: 2 })


            viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: true })
        }
    }))

    const memoizedScrollAnimation = useCallback(
        (position, target, isMobile, onUpdate) => {
            if (position && target && onUpdate) {
                scrollAnimation(position, target, isMobile, onUpdate)
            }
        }, []
    )

    const setupViewer = useCallback(async () => {
        // Initialize the viewer
        const viewer = new ViewerApp({
            canvas: canvasRef.current,
        })

        setViewerRef(viewer)
        // seting the function for the mobliecheck
        const isMobileOrTablet = mobileAndTabletCheck()
        setIsMobile(isMobileOrTablet)



        const manager = await viewer.addPlugin(AssetManagerPlugin)

        // Add plugins individually.

        const camera = viewer.scene.activeCamera;
        const position = camera.position;
        const target = camera.target;


        // calling all the function being implemenet for the state
        setCameraRef(camera)
        setPositionRef(position)
        setTargetRef(target)

        await viewer.addPlugin(GBufferPlugin)
        await viewer.addPlugin(new ProgressivePlugin(32))
        await viewer.addPlugin(new TonemapPlugin(true))
        await viewer.addPlugin(GammaCorrectionPlugin)
        await viewer.addPlugin(SSRPlugin)
        await viewer.addPlugin(SSAOPlugin)
        await viewer.addPlugin(BloomPlugin)
        // and many more...

        viewer.renderer.refreshPipeline()

        // Import and add a GLB file.
        await manager.addFromPath("scene-black.glb")

        viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

        // I want to disablie when i load the user which i want to set it to flase
        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false })


        if (isMobileOrTablet) {
            position.set(-16.7, 1.17, 11.7)
            target.set(0, 1.37, 0)
            props.contentRef.current.className = "mobile-or-tablet"
        }
        // when ever i reload my website i wnat the postion to be on top
        window.scrollTo(0, 0);

        let needsUpdate = true;

        const onUpdate = () => {
            needsUpdate = true
            viewer.setDirty();
        }

        // if update is needed in which i wnat to call the carmera
        viewer.addEventListener("postFrame", () => {
            if (needsUpdate) {
                camera.positionTargetUpdated(true);
                needsUpdate = false;
            }
        })

        // calling the function
        memoizedScrollAnimation(position, target, isMobileOrTablet, onUpdate);
    }, []);


    useEffect(() => {
        setupViewer();
    }, [])


    const handleExit = useCallback(() => {
        canbvasContainerRef.current.style.pointerEvents = "none";
        props.contentRef.current.style.opacity = "1";

        viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: false })
        setPreviewMode(false)
        gsap.to(positionRef, {
            x: !isMobile ? 1.56 : 9.36,
            y: !isMobile ? 5.0 : 10.95,
            z: !isMobile ? 0.01 : 0.09,
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
            x: !isMobile ? -0.55 : -1.62,
            y: !isMobile ? 0.32 : 0.02,
            z: !isMobile ? 0.0 : -0.06,
            scrollTrigger: {
                trigger: ".display-section",
                start: "top bottom",
                end: "top top",
                scrub: 2,
                immediateRender: false,
            },
        });
        // next is to update the functon into there dependentes
    }, [canbvasContainerRef, viewerRef, positionRef, cameraRef, targetRef])


    return (
        <div ref={canbvasContainerRef} id='webgi-canvas-container'>
            <canvas id='webgi-canvas' ref={canvasRef}></canvas>
            {
                previewMode && (
                    <button className="button" onClick={handleExit}>Exit</button>
                )
            }

        </div>
    )
}

)

export default WebgiViewer