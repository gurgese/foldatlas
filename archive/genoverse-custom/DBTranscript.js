// Ensembl REST API Transcript model

Genoverse.Track.Model.Transcript.DBTranscript = Genoverse.Track.Model.Transcript.extend({

  // TODO pull this from config
  // url      : 'http://rnabrowser.dev/test',
  url: window.foldatlasConfig.appBaseUrl+"/ajax/genome-browser/transcripts?chr=__CHR__&start=__START__&end=__END__",
  // dataRequestLimit : 5000000, // As per e! REST API restrictions
  
  // The url above responds in json format, data is an array
  // See rest.ensembl.org/documentation/info/feature_region for more details
  parseData: function (data) {
    for (var i = 0; i < data.length; i++) {
      var feature = data[i];
      
      if (feature.feature_type === 'transcript' && !this.featuresById[feature.id]) {
        feature.label = feature.id;
        feature.exons = [];
        feature.cds   = [];
        
        this.insertFeature(feature);
      } else if (feature.feature_type === 'exon' && this.featuresById[feature.Parent]) {
        if (!this.featuresById[feature.Parent].exons[feature.id]) {
          this.featuresById[feature.Parent].exons.push(feature);
          this.featuresById[feature.Parent].exons[feature.id] = feature;
        }
      } else if (feature.feature_type === 'CDS' && this.featuresById[feature.Parent]) {
        feature.id = feature.start + '-' + feature.end;
        
        if (!this.featuresById[feature.Parent].cds[feature.id]) {
          this.featuresById[feature.Parent].cds.push(feature);
          this.featuresById[feature.Parent].cds[feature.id] = feature;
        }
      }
    }
  }
});
