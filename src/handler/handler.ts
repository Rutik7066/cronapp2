/**
 * Type of campaign text/only, image/only, video/only,  text/image, text/video.
 *
 * Route handler will get id of camapign and type of campaign and is sheduled or not
 * then fetch camapaign
 * then check whether sheduled or not
 * if it is sheduled then calculate time for cron job and start cron job
 * else it is not sheduled then check status is Not started if yes then start campaign without cron job
 *
 *
 * */

import { Request, Response, RequestHandler, text } from "express";
import pb from "../utils/pocketbase.js";
import cron from "node-cron";
import {
  sendImage,
  sendText,
  sendVideo,
} from "../utils/whatsapp_backend.js";
import { whatsapp_backend_url } from "../utils/const.js";
import { getCronExpression, pauseLoop } from "../utils/utils.js";

export const mainRouteHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  console.log("started");

  const scheduled: boolean = req.query.scheduled
    ?.toString()
    .startsWith("true")!;

  const id: string = req.query.id?.toString()!;

  const type: string = req.query.type?.toString()!;

  try {
    const camp = await pb.collection("campaign").getOne(id);
    const user = await pb.collection("users").getOne(camp.user);
    // Cheking status
    const what = await fetch(`${whatsapp_backend_url}/session/status?token=${user.waToken}`);
    const data = await what.json();
    console.log("status", data);
    if (data.code != 200) {
      return res.json(data);
    }
    if (scheduled) {
      const time = getCronExpression(camp.sheduled_at);
      cron.schedule(
        time,
        async () => {
          //
        },
        {
          scheduled: true,
        }
      );
      return res.status(200).json({ 'code': "200", "message": "Ad scheduled perfectly" });
    } else {
      if (camp.status.match("Not started")) {
        // console.log("Connect to server");
        // await connect(user)
        camp.status = "Running";
        const last = await pb.collection("campaign").update(camp.id, camp);
        const contact: any[] = user.contacts as any[];
        res.sendStatus(200)
        for (let index = 0; index < contact.length; index++) {
          const number = contact[index].num;
          console.log('[last camp]');
          console.log(last.to[index - 1]);
          const upCamp = await pb.collection("campaign").getOne(camp.id);
          const upUser = await pb.collection("users").getOne(camp.user);
          console.log(`[Contact]: ${number} ${type}`);
          switch (type) {
            case "text":
              await sendText(upUser, number, upCamp);
              break;
            case "image":
              await sendImage(upUser, number, upCamp);
              break;
            case "video":
              await sendVideo(upUser, number, upCamp);
              break;
            default:
              break;
          }
          await pauseLoop()
        }
        console.log("ended");
        const l = await pb.collection("campaign").getOne(camp.id);
        l.status = "Done";
        await pb.collection("campaign").update(camp.id, l);
        // await disconnect(user)
        return
      }
    }
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
  return res.sendStatus(404)
};
