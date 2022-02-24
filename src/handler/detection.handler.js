exports.parseDetectionData = (data) => {
  let newData = data;
  for (let i = 0; i < newData.length; i++) {
    newData[i].product_detection = newData[i].product_detection.map((element) => 
    {
      element["id"] = newData[i].id;
      element["rack_id"] = newData[i].rack_id;
      element["date"] = newData[i].date;
      element["status"] = newData[i].status;
      return element;
    });
    // delete newData[i].id;
    // delete newData[i].rack_id;
    delete newData[i].date;
    // delete newData[i].status;
  }
  // console.log(newData[0].product_detection);
  return newData;
}