const path = require('path');

const renderIndex = (req, res) => {
  const indexPath = path.join(__dirname, '..', 'public', 'index.html');

  //..\public\index.html relative Path
  //C:\Users\jecheverri\Documents\Acaemlo\Node\heroku-schedulev3\Public\index.html absolute path
  console.log(__dirname);
  console.log(indexPath);

  res.status(200).sendFile(indexPath);
};

module.exports = { renderIndex };
