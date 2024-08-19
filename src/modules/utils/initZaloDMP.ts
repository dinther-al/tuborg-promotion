interface CustomWindow extends Window {
  ztr?: any;
}

const initZaloDMP = (trackingId: string): void => {
  try {
    const customWindow = window as CustomWindow;
    if (customWindow.ztr) {
      return;
    }

    if (!customWindow.ztr) {
      const n: any = (customWindow.ztr = function (act: any, evt: any, arg: any) {
        if (n && n.callMethod) {
          n.callMethod.apply(act, evt, arg);
        } else {
          n.queue.push({ action: act, event: evt, arguments: arg });
        }
      });
      n.queue = n.queue || [];
      const zs = document.createElement("script");
      zs.src = `https://px.dmp.zaloapp.com/ztr.js?id=${trackingId}`;
      zs.async = true;

      document.head.appendChild(zs);

      zs.addEventListener("load", function (event) {
        customWindow.ztr("init", trackingId);
        console.log("script ztr.js loaded :)");
        customWindow.ztr("track", "PageView");
      });
    }
  } catch (error) {
    console.log("init ztr.js error", error);
  }
};

export default initZaloDMP;
