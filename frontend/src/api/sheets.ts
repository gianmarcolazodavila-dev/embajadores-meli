// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fetchJSONP(url: string): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Promise((resolve, reject) => {
    const callbackName = 'cb_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP timeout'));
    }, 10000);

    function cleanup() {
      clearTimeout(timeout);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any)[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)[callbackName] = (data: any) => {
      cleanup();
      resolve(data);
    };

    const separator = url.includes('?') ? '&' : '?';
    script.src = url + separator + 'callback=' + callbackName;
    script.onerror = () => { cleanup(); reject(new Error('JSONP error')); };
    document.head.appendChild(script);
  });
}

const API_URL = 'https://script.google.com/a/macros/mercadolibre.com/s/AKfycbyV6w9BwYpJmJSnW6CzdCVdYaPxr4xuwwOVOt5HQ7yucJDGCD-a1dx0pNWz99u_XXIR/exec';

export const api = {
  getEmbajadores: () => fetchJSONP(API_URL + '?action=getEmbajadores'),
  getEmbajador: (id: string) => fetchJSONP(API_URL + '?action=getEmbajador&id=' + id),
  getReferidosMGM: (ambassador_id: string) => fetchJSONP(API_URL + '?action=getReferidosMGM&ambassador_id=' + ambassador_id),
  getWallet: (ambassador_id: string) => fetchJSONP(API_URL + '?action=getWallet&ambassador_id=' + ambassador_id),
};
