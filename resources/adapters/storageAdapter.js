const get = ({key}) => {
    const promise = new Promise((resolve, reject) => {
        NativeStorage.getItem(key, (value) => {
            resolve(value);
        }, (error) => {
            resolve(undefined);
        })
    });
    return promise;
};

const set = async ({key, value}) => {
    NativeStorage.setItem(key, value);
};

export default { get, set };