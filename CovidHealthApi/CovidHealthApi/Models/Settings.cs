namespace CovidHealthApi.Models
{
    public class Settings
    {
        public string Database { get; set; }

        public string ConnectionString { get; set; } 

        public string Container { get; set; }

        public bool IsContained { get; set; }

        public bool Development { get; set; }

        public string User { get; set; }

        public string Password { get; set; }

        public string Host { get; set; }

        public string Port { get; set; }
    }
}
