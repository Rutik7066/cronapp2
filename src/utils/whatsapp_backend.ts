import { Record } from "pocketbase";
import { pocketbase_url, whatsapp_backend_url } from "./const.js";
import pb from "./pocketbase.js";
import { fetchAndConvertToBase64, pauseLoop } from "./utils.js";
import { y } from "./tests.js";

export const connect = async (user: Record) => {
  const re = await fetch(`${whatsapp_backend_url}/session/connect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: user.waToken
    },
    body: JSON.stringify({
      "Subscribe": [
        "Message",
        "ChatPresence"
      ],
      "Immediate": true
    }),
  });
  console.log(await re.json());

}

export const disconnect = async (user: Record) => {
  const re = await fetch(`${whatsapp_backend_url}/session/disconnect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: user.waToken
    },
  });
  console.log(await re.json());

}


export const composing = async (user: Record, contact: string) => {
  await fetch(`${whatsapp_backend_url}/chat/presence`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: user.waToken
    },
    body: JSON.stringify({
      Phone: `91${contact}`,
      "State": "composing",
    }),
  });
}
export const paused = async (user: Record, contact: string) => {
  await fetch(`${whatsapp_backend_url}/chat/presence`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: user.waToken
    },
    body: JSON.stringify({
      Phone: `91${contact}`,
      "State": "paused",
    }),
  });
}
export const sendText = async (
  user: Record,
  contact: string,
  camp: Record
): Promise<void> => {
  await composing(user, contact);
  await pauseLoop()
  const what = await fetch(`${whatsapp_backend_url}/chat/send/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: user.waToken,
    },
    body: JSON.stringify({
      Phone: `91${contact}`,
      Body: camp.text,
      Id: camp.id,
    }),
  });
  const data = await what.json();
  console.log(data);
  if (data.success == true) {
    const newcamp = {
      to: contact,
      created: new Date(),
      status: "Successful",
    };
    const newToJson = [...camp.to, newcamp];
    camp.to = newToJson;
    camp.succefull_contact = camp.succefull_contact + 1;
    try {
      const upCamp = await pb.collection("campaign").update(camp.id, camp);
    } catch (error) {
      console.log("error at upCamp 1");
      console.log(error);
      const upCamp = await pb.collection("campaign").update(camp.id, camp);
    }
    user.credit = user.credit - 1;
    try {
      const upUser = await pb.collection("users").update(user.id, user);
    } catch (error) {
      console.log("error at upUser 1");
      console.log(error);
      const upUser = await pb.collection("users").update(user.id, user);
    }
  } else {
    const newcamp = {
      to: contact,
      created: new Date(),
      status: "Failed",
    };
    const newToJson = [...camp.to, newcamp];
    camp.to = newToJson;
    camp.failed_contact = camp.failed_contact + 1;
    try {
      const upCamp = await pb.collection("campaign").update(camp.id, camp);
    } catch (error) {
      console.log("error at upCamp 1");
      console.log(error);
      const upCamp = await pb.collection("campaign").update(camp.id, camp);
    }
    user.credit = user.credit - 1;
    try {
      const upUser = await pb.collection("users").update(user.id, user);
    } catch (error) {
      console.log("error at upUser 1");
      console.log(error);
      const upUser = await pb.collection("users").update(user.id, user);
    }
  }
  await paused(user, contact);
};

export const sendImage = async (
  user: Record,
  contact: string,
  camp: Record
): Promise<boolean> => {
  await composing(user, contact);
  await pauseLoop()
  const imageBase = await fetchAndConvertToBase64(
    `${pocketbase_url}/api/files/campaign/${camp.id}/${camp.attachment}`
  );
  if (imageBase === undefined) {
    return false;
  }
  const what = await fetch(`${whatsapp_backend_url}/chat/send/image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: user.waToken,
    },
    body: JSON.stringify({
      Phone: `91${contact}`,
      Image: imageBase,
      Caption: camp.text,
      Id: camp.id
    }),
  });
  const data = await what.json();
  console.log(data);
  if (data.success == true) {
    const newcamp = {
      to: contact,
      created: new Date(),
      status: "Successful"
    };
    const newToJson = [...camp.to, newcamp];
    camp.to = newToJson;
    camp.succefull_contact = camp.succefull_contact + 1;
    try {
      const upCamp = await pb.collection("campaign").update(camp.id, camp);
    } catch (error) {
      console.log("error at upCamp 1");
      console.log(error);
      try {
        const upCamp = await pb.collection("campaign").update(camp.id, camp);
      } catch (error) {
        return false;
      }
    }
    user.credit = user.credit - 1;
    try {
      const upUser = await pb.collection("users").update(user.id, user);
    } catch (error) {
      console.log("error at upUser 1");
      console.log(error);
      try {
        const upUser = await pb.collection("users").update(user.id, user);
      } catch (error) {
        return false;
      }
    }
  } else {
    const newcamp = {
      to: contact,
      created: new Date(),
      status: "Failed"
    };
    const newToJson = [...camp.to, newcamp];
    camp.to = newToJson;
    camp.failed_contact = camp.failed_contact + 1;
    try {
      const upCamp = await pb.collection("campaign").update(camp.id, camp);
    } catch (error) {
      console.log("error at upCamp 1");
      console.log(error);
      try {
        const upCamp = await pb.collection("campaign").update(camp.id, camp);
      } catch (error) {
        return false;
      }
    }
    user.credit = user.credit - 1;
    try {
      const upUser = await pb.collection("users").update(user.id, user);
      return true;
    } catch (error) {
      console.log("error at upUser 1");
      console.log(error);
      try {
        const upUser = await pb.collection("users").update(user.id, user);
      } catch (error) {
        return false;
      }
    }
  }
  await paused(user, contact);
  return true;
};

export const sendVideo = async (
  user: Record,
  contact: string,
  camp: Record
): Promise<boolean> => {
  await composing(user, contact);
  await pauseLoop()

  const videoBase =await fetchAndConvertToBase64(
    `${pocketbase_url}/api/files/campaign/${camp.id}/${camp.attachment}`
  );
  if (videoBase === undefined) {
    return false;
  }
  const what = await fetch(`${whatsapp_backend_url}/chat/send/video`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: user.waToken
    },
    body: JSON.stringify({
      Phone: `91${contact}`,
      Video: videoBase,
      Caption: camp.text,
      Id: camp.id
    }),
  });
  const data = await what.json();
  console.log(data);
  if (data.success == true) {
    const newcamp = {
      to: contact,
      created: new Date(),
      status: "Successful"
    };
    const newToJson = [...camp.to, newcamp];
    camp.to = newToJson;
    camp.succefull_contact = camp.succefull_contact + 1;
    try {
      const upCamp = await pb.collection("campaign").update(camp.id, camp);
    } catch (error) {
      console.log("error at upCamp 1");
      console.log(error);
      try {
        const upCamp = await pb.collection("campaign").update(camp.id, camp);
      } catch (error) {
        return false;
      }
    }
    user.credit = user.credit - 1;
    try {
      const upUser = await pb.collection("users").update(user.id, user);
    } catch (error) {
      console.log("error at upUser 1");
      console.log(error);
      try {
        const upUser = await pb.collection("users").update(user.id, user);
      } catch (error) {
        return false;
      }
    }
  } else {
    const newcamp = {
      to: contact,
      created: new Date(),
      status: "Failed",
    };
    const newToJson = [...camp.to, newcamp];
    camp.to = newToJson;
    camp.failed_contact = camp.failed_contact + 1;
    try {
      const upCamp = await pb.collection("campaign").update(camp.id, camp);
    } catch (error) {
      console.log("error at upCamp 1");
      console.log(error);
      try {
        const upCamp = await pb.collection("campaign").update(camp.id, camp);
      } catch (error) {
        return false;
      }
    }
    user.credit = user.credit - 1;
    try {
      const upUser = await pb.collection("users").update(user.id, user);
    } catch (error) {
      console.log("error at upUser 1");
      console.log(error);
      try {
        const upUser = await pb.collection("users").update(user.id, user);
      } catch (error) {
        return false;
      }
    }
  }
  await paused(user, contact);
  return true;
};
