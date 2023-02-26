export const imageFileFilter = (req: Request, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new Error(
        'Only image files are allowed! Image files allowed such as png, jpeg, jpg, gif',
      ),
      false,
    );
  }
  callback(null, true);
};
