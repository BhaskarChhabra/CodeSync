import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Interview = Doc<"interviews">;

function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();

  // Log the entire interview object to check what fields exist
  console.log("Interview object:", interview);

  // Log startTime explicitly to see if it exists and its type
  console.log("interview.startTime (raw):", interview.startTime);
  console.log("interview.startTime (type):", typeof interview.startTime);

  // Defensive check: log formatted date only if startTime exists
  let formattedDate = "Invalid Date";
  if (interview.startTime) {
    try {
      formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a");
    } catch (error) {
      console.error("Error formatting startTime:", error);
    }
  } else {
    console.warn("Warning: interview.startTime is undefined or null");
  }

  // Log endTime and current time for additional debugging
  console.log("interview.endTime:", interview.endTime);
  console.log("Current date/time:", new Date());

  const status = getMeetingStatus(interview);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {formattedDate}
          </div>

          <Badge
            variant={
              status === "live" ? "default" : status === "upcoming" ? "secondary" : "outline"
            }
          >
            {status === "live" ? "Live Now" : status === "upcoming" ? "Upcoming" : "Completed"}
          </Badge>
        </div>

        <CardTitle>{interview.title}</CardTitle>

        {interview.description && (
          <CardDescription className="line-clamp-2">{interview.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {status === "live" && (
          <Button className="w-full" onClick={() => joinMeeting(interview.streamCallId)}>
            Join Meeting
          </Button>
        )}

        {status === "upcoming" && (
          <Button variant="outline" className="w-full" disabled>
            Waiting to Start
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default MeetingCard;
