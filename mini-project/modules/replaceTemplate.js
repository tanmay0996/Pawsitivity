const replace = (temp, product) => {
  let output = temp.replace(/{%PET_NAME%}/g, product.pet);
  output = output.replace(/{%PET_BREED%}/g, product.breed);
  output = output.replace(/{%PET_IMAGE%}/g, product.imageUrl);
  output = output.replace(/{%PET_POSTER%}/g, product.name);
  output = output.replace(/{%POSTER_CONTACT%}/g, product.contactNo);
  output = output.replace(/{%POSTER_EMAIL%}/g, product.email);
  output = output.replace(/{%MESSAGE%}/g, product.message);
  output = output.replace(/{%LOCATION%}/g, product.location);
  output = output.replace(/{%ID%}/g, product.id || 'No ID');

  return output;
};

export default replace;
