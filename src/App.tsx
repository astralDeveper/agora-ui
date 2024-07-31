import React, { CSSProperties, useState, useEffect } from "react";
import AgoraUIKit, { layout } from "agora-react-uikit";
import "agora-react-uikit/dist/index.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import Message from "../src/components/Message"
const App: React.FunctionComponent = () => {
  const [videocall, setVideocall] = useState(false);
  const [isHost, setHost] = useState(true);
  const [isPinned, setPinned] = useState(false);
  const [username, setUsername] = useState("");
  const [screenSharing, setScreenSharing] = useState(false);
  const [client] = useState(() =>
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );
  const [screenTrack, setScreenTrack] = useState<AgoraRTC.IStream | null>(null);

  useEffect(() => {
    const joinChannel = async () => {
      if (videocall) {
        try {
          await client.join(
            "f13fcfbd9cc84e6cb286d00641cbba21",
            "webapp",
            "007eJxTYDgWpndhg35VuKmd03sPqc0TC24s6VT+U6T4+mVGzxmtqfUKDGmGxmnJaUkplsnJFiapZslJRhZmKQYGZiaGyUlJiUaGyedWpjUEMjKYnYtgZmRgZGABYhCfCUwyg0kWMMnGUJ6alFhQwMAAADdxJBA="
          );
        } catch (error) {
          console.error("Join channel error:", error);
        }
      }
    };

    joinChannel();

    return () => {
      client
        .leave()
        .catch((error) => console.error("Leave channel error:", error));
    };
  }, [videocall, client]);

  const handleScreenShare = async () => {
    try {
      if (!screenSharing) {
        // Create a screen sharing track
        const screenTrack = await AgoraRTC.createScreenVideoTrack();

        // Publish the screen sharing track
        await client.publish(screenTrack);
        setScreenTrack(screenTrack);
        setScreenSharing(true);
      } else {
        // Unpublish and stop the screen sharing track
        if (screenTrack) {
          await client.unpublish(screenTrack);
          screenTrack.stop();
          setScreenTrack(null);
          setScreenSharing(false);
        }
      }
    } catch (error) {
      console.error("Screen share error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <h1 style={styles.heading}>Agora React Web UI Kit</h1>
        {videocall ? (
          <>
            <div style={styles.nav}>
              <p style={{ fontSize: 20, width: 200 }}>
                You're {isHost ? "a host" : "an audience"}
              </p>
              {/* <p style={styles.btn} onClick={() => setHost(!isHost)}>
                Change Role
              </p> */}
              {/* <p style={styles.btn} onClick={() => setPinned(!isPinned)}>
                Change Layout
              </p> */}
              <p style={styles.btn} onClick={handleScreenShare}>
                {screenSharing ? "Stop Screen Share" : "Start Screen Share"}
              </p>
            </div>

              <AgoraUIKit
                rtcProps={{
                  appId: 'f13fcfbd9cc84e6cb286d00641cbba21',
                  channel: 'webapp',
                  token: '007eJxTYDgWpndhg35VuKmd03sPqc0TC24s6VT+U6T4+mVGzxmtqfUKDGmGxmnJaUkplsnJFiapZslJRhZmKQYGZiaGyUlJiUaGyedWpjUEMjKYnYtgZmRgZGABYhCfCUwyg0kWMMnGUJ6alFhQwMAAADdxJBA=',
                  role: isHost ? 'host' : 'audience',
                  layout: isPinned ? layout.pin : layout.grid,
                }}
                rtmProps={{ username: username || 'user', displayUsername: true }}
                callbacks={{
                  EndCall: () => setVideocall(false),
                }}
              />

              <Message style={styles.messageMain}/>

          </>
        ) : (
          <div style={styles.nav}>
            <input
              style={styles.input}
              placeholder="nickname"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <h3 style={styles.btn} onClick={() => setVideocall(true)}>
              Start Call
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flex: 1,
    backgroundColor: "#007bff22",
  },
  heading: { textAlign: "center" as const, marginBottom: 0 },
  videoContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  } as CSSProperties,
  nav: { display: "flex", justifyContent: "space-around" },
  btn: {
    backgroundColor: "#007bff",
    cursor: "pointer",
    borderRadius: 5,
    padding: "4px 8px",
    color: "#ffffff",
    fontSize: 20,
  },
  messageMain: {
    position: "absolute",
    right: 0
  },
  input: { display: "flex", height: 24, alignSelf: "center" } as CSSProperties,

};

export default App;
