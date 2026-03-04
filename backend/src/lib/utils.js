const getBase64SizeInKB = (base64String) => {
    const base64Data = base64String.split(",")[1] || base64String;
    const sizeInBytes = (base64Data.length * 3) / 4;
    return sizeInBytes / 1024;
};

export default getBase64SizeInKB;
