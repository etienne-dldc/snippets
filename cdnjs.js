function loadScript(url) {
  var script = document.createElement('script');
  script.type = 'text/javascript';

  script.onload = function() {
    console.log('Script loaded : ' + url);
  };

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/loadjs/3.5.1/loadjs.min.js');
loadScript('https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.2/axios.min.js');

function cdnjs(lib, indexList) {
  axios.get('https://api.cdnjs.com/libraries/' + lib).then(result => {
    var data = result.data;
    var version = data.version;
    if (!version) {
      console.log(`Can't find ${lib}`);
      axios.get(`https://api.cdnjs.com/libraries?search=${lib}`)
        .then(result => {
          var data = result.data;
          console.log(
            data.results.map(result => result.name).join('\n')
          );
        })
      return;
    }
    var files = data.assets.find(asset => asset.version === version).files;
    if (indexList === undefined) {
      console.log(files.map((file, index) => `${index} => ${file}`).join('\n'));
      return;
    }
    var indexArray = Array.isArray(indexList) ? indexList : [indexList];
    var paths = indexArray.map(
      fileIndex => `https://cdnjs.cloudflare.com/ajax/libs/${lib}/${version}/${files[fileIndex]}`
    );
    console.log(paths.map(path => `Loading: ${path}`).join('\n'));
    loadjs(paths, {
      success: function() {
        console.log('loaded');
      },
      async: false,
    });
  });
}
