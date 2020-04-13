using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace CovidHealthApi.Models
{
    public class Country
    {
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonProperty("_id")]
        public string _id { get; private set; }

        public List<Region> alldata { get; set; }
    }

    public class Region
    {
        [JsonProperty("region")]
        public string region { get; set; }

        [JsonProperty("values")]
        public List<Details> values { get; set; }
    }


    public class Details
    {
        [JsonProperty("place")]
        public string place { get; set; }

        [JsonProperty("job")]
        public string job { get; set; }

        [JsonProperty("phonenumber")]
        public string phonenumber { get; set; }
        [JsonProperty("openinghours")]
        public string openinghours { get; set; }
        [JsonProperty("remarks")]
        public string remarks { get; set; }
        [JsonProperty("url")]
        public string url { get; set; }
    }
}
