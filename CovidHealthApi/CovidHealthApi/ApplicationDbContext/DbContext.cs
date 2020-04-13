using CovidHealthApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Linq;

namespace CovidHealthApi.ApplicationDbContext
{
    public interface IDbContext
    {
        Country GetAll(string name);
        FeedbackData AddFeedback(FeedbackData feedback); 
    }

    public class DbContext : IDbContext
    {
        private readonly IMongoDatabase _db;
        const string _feedbackCollectionName = "feedback";
        const string _defaultCountryCollectionName = "germany";

        public DbContext(IOptions<Settings> options)
        {   
            var client = new MongoClient(options.Value.ConnectionString);
             
            _db = client.GetDatabase(options.Value.Database);
        }

        public Country GetAll(string name = _defaultCountryCollectionName)
        {
            var collection = _db.GetCollection<Country>(name.ToLower());

            return collection.Find(_ => true).ToList().FirstOrDefault();
        }

        public FeedbackData AddFeedback(FeedbackData feedback)
        {
            var collection = _db.GetCollection<FeedbackData>(_feedbackCollectionName);

            if (string.IsNullOrEmpty(feedback.id))
            { 
                collection.InsertOne(feedback);

                var record = collection.Find(_ => true).SortByDescending(a => a.id).Limit(1).FirstOrDefault();

                return record;
            }
            else
            {
                var filter = Builders<FeedbackData>.Filter.Eq(s => s.id, feedback.id);

                var col = collection.ReplaceOne(filter, feedback);

                var record = collection.Find(a => a.id == feedback.id).Limit(1).FirstOrDefault();

                return record;
            }
            
        }      
    }
}
