const {ImageKit} = require("@imagekit/nodejs");

const ImageKitClient = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_placeholder",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://imagekit.io/dashboard/stonebeam2026"
})

const uploadUserFile = async (file, user) => {
  try{
    let folderPath = '/root';
    if(user.type === 'Builder'){
      folderPath = '/uploads/Builders';
    }
    else if(user.type ==='Client'){
      folderPath = '/uploads/Client';
    }
    else if(user.type === 'Labourer'){
      folderPath = '/uploads/Labourer';
    }
    else if(user.type === 'Skilled-Labourer'){
      folderPath = '/uploads/Skilled-Labourer';
    }
    else if(user.type === 'Dealer'){
       folderPath = '/uploads/Dealer';
    }
    else{
       folderPath = '/uploads/Contractor';
    }
  
  const result = await ImageKitClient.files.upload({
    file: file,
    fileName: `${user.type}_${Date.now()}`,
    folder: folderPath
  });

  console.log("Upload successful!");
  return result;
}
catch(err){
  console.error("Upload failed:", err.message);
}
}
module.exports = {uploadUserFile };

//["Client","Builder","Labourer","Skilled-Labourer","Dealer","Contractor"]