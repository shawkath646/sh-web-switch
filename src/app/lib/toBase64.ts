export default function toBase64 (file: File) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
  
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          resolve(fileReader.result?.split(',')[1]);
        }
      };
  
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
};