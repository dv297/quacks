const generateId = () => {
  let currentId = 0;

  const increment = () => {
    currentId++;
    return currentId;
  };

  return increment();
};

export default generateId;
