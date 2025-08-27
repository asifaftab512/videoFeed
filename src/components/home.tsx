import React from "react";
import Sidebar from "./Navbar"; // Use the new Sidebar
import VideoScreen from "./video-screen";

function Home() {
  return (
    <div className="flex ">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content shifted right */}
      <main className="flex-1 ml-72">
        <VideoScreen />
      </main>
    </div>
  );
}

export default Home;
