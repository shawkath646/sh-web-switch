export default function generateSiteID() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomCode = '';
  
    for (let i = 0; i < 32; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters.charAt(randomIndex);
    }
  
    return randomCode;
}

  