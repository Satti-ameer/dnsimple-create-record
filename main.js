/**
 * Create DNSimple DNS Record Action for GitHub
 * https://github.com/marketplace/actions/dnsimple-create-record
 */

const path = require("path");
const cp = require("child_process");

const getRecord = () => {
  // https://developer.dnsimple.com/v2/zones/records/#listZoneRecords
  const { status, stdout } = cp.spawnSync("curl", [
    ...["--request", "GET"],
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Accept: application/json"],
    ...["--silent"],
    `https://api.dnsimple.com/v2/${process.env.INPUT_ACCOUNT}/zones/${process.env.INPUT_ZONE}/records?name=${process.env.INPUT_NAME}`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const result = JSON.parse(stdout.toString());
  const recordData = result.data; 

  if (!recordData) {
    outputErrors(result);
    process.exit(1)
  }

  const recordId = ((recordData.length > 0) ? recordData[0].id : null);

  if (!recordId) {
    return null;
  }

  return recordId;
};

const createRecord = () => {
  // https://developer.dnsimple.com/v2/zones/records/#createZoneRecord
  const { status, stdout } = cp.spawnSync("curl", [
    ...["--request", "POST"],
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Accept: application/json"],
    ...["--header", "Content-Type: application/json"],
    ...["--silent", "--data"],
    JSON.stringify({
      name: process.env.INPUT_NAME,
      type: process.env.INPUT_TYPE,
      content: process.env.INPUT_CONTENT,
      ttl: Number(process.env.INPUT_TTL),
      priority: Number(process.env.INPUT_PRIORITY),
      regions: ((process.env.INPUT_REGIONS == '') ? undefined : regions),
    }),
    `https://api.dnsimple.com/v2/${process.env.INPUT_ACCOUNT}/zones/${process.env.INPUT_ZONE}/records`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const result = JSON.parse(stdout.toString());

  if ('data' in result) {
    console.log(`::set-output name=id::${result.data.id}`);
  } else {
    outputErrors(result);
  }
};

const updateRecord = (id) => {
  // https://developer.dnsimple.com/v2/zones/records/#updateZoneRecord
  const { status, stdout } = cp.spawnSync("curl", [
    ...["--request", "PATCH"],
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Accept: application/json"],
    ...["--header", "Content-Type: application/json"],
    ...["--silent", "--data"],
    JSON.stringify({
      name: process.env.INPUT_NAME,
      type: process.env.INPUT_TYPE,
      content: process.env.INPUT_CONTENT,
      ttl: Number(process.env.INPUT_TTL),
      priority: Number(process.env.INPUT_PRIORITY),
      regions: ((process.env.INPUT_REGIONS == '') ? undefined : regions),
    }),
    `https://api.dnsimple.com/v2/${process.env.INPUT_ACCOUNT}/zones/${process.env.INPUT_ZONE}/records/${id}`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const result = JSON.parse(stdout.toString());

  if ('data' in result) {
    console.log(`::set-output name=id::${result.data.id}`);
  } else {
    outputErrors(result);
  }
};

const outputErrors = (result) => {
  console.log(`::error ::${result.message}`);
  if ('errors' in result.message) {
    console.log(`::error ::${result.message.errors.base[0]}`);
  }
}

const currentRecord = getRecord();
if (currentRecord) {
  updateRecord(currentRecord);
  process.exit(0);
}
createRecord();
