import DisplaySection from "./components/DisplaySection";
import Navbar from "./components/Navbar";
import SoundSection from "./components/SoundSection";
import WebgiViewer from "./components/WebgiViewer";
import Jumbotron from "./components/Jumbotron";
import Loader from "./components/Loader";
import { useRef } from "react";

function App() {

    const webgiViewerRef = useRef()
    const contentRef = useRef()

    // next to define the new function
    const handlePreview = () => {
        webgiViewerRef.current.triggerPreview()
    }
    return (
        <div className="App">
            <Loader />
            <div ref={contentRef} id="content">
                <Navbar />
                <Jumbotron />
                <SoundSection />
                <DisplaySection triggerPreview={handlePreview} />
            </div>
            <WebgiViewer contentRef={contentRef} ref={webgiViewerRef} />
        </div>
    )
}

export default App;

