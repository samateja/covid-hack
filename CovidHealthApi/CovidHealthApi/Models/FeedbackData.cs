using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace CovidHealthApi.Models
{
    public class FeedbackData
    {
        [BsonRepresentation(BsonType.ObjectId)]       
        public string id { get; set; }
        public string Name { get; set; }
        public long Age { get; set; }
        public LocationObj LocationObj { get; set; }
        public string Feedback { get; set; }
        public List<Result> Results { get; set; }
    }

    public class LocationObj
    {
        public string Lat { get; set; }
        public string Lng { get; set; }
        public Place Place { get; set; }
    }

    public partial class Place
    {
        public string Country { get; set; }
        public string City { get; set; }
        public string State { get; set; }
    }

    public class Result
    {
        public long Id { get; set; }    
        public string Name { get; set; }
        public string State { get; set; }
        public string Answer { get; set; }
    }


}
