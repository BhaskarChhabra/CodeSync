import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { stopAllMediaTracks } from "../lib/stopMedia";

function EndCallButton() {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const updateInterviewStatus = useMutation(api.interviews.updateInterviewStatus);

  const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
    streamCallId: call?.id || "",
  });

  if (!call || !interview) return null;

  const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
  try {
    console.log("Ending call", call?.id, interview?._id);
    await call.endCall();
    stopAllMediaTracks();

    if (!interview?._id) {
      toast.error("Interview not found");
      return;
    }

    await updateInterviewStatus({
      id: interview._id,
      status: "completed",
    });

    router.push("/");
    toast.success("Meeting ended for everyone");
  } catch (error) {
    console.error("End call error:", error);
    toast.error("Failed to end meeting");
  }
};
  return (
    <Button variant="destructive" onClick={endCall}>
      End Meeting
    </Button>
  );
}
export default EndCallButton;
