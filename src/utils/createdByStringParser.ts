const parseCreatedBy = (createdByString: string) => {
  try {
    // Extract Name using regex
    const nameMatch = createdByString.match(/Name\s*=\s*([^,]+)/);
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown';

    const emailMatch = createdByString.match(/Email\s*=\s*([^,}]+)/);
    const email = emailMatch ? emailMatch[1].trim() : 'Unknown';

    return {Name: name, Email: email};
  } catch (error) {
    console.error('Error parsing createdBy string:', error);
    return {Name: 'Unknown', Email: 'Unknown'};
  }
};

export default parseCreatedBy;
