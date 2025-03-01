import Mellowtel from "mellowtel";
import { DISABLE_LOGS_MELLOWTEL } from "./constants";
import { getConfigKey } from "./configuration/get_configuration_key";

let mellowtel;

(async () => {
  const configKey = (await getConfigKey()).toString();
  mellowtel = new Mellowtel(configKey, {
    disableLogs: DISABLE_LOGS_MELLOWTEL,
  });
  await mellowtel.initPascoli();
})();
