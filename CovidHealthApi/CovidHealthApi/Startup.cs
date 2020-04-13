using System.Collections.Generic;
using CovidHealthApi.ApplicationDbContext;
using CovidHealthApi.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace CovidHealthApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var _serializerSettings = new JsonSerializerSettings()
            {
                Converters = new List<JsonConverter> { new ObjectIdConverter() }
            };

            services.Configure<Settings>(
             options =>
             {
                 options.ConnectionString = Configuration.GetSection("MongoDb:ConnectionString").Value;
                 options.Database = Configuration.GetSection("MongoDb:Database").Value;
                 options.User = Configuration.GetSection("MongoDb:User").Value;
                 options.Password = Configuration.GetSection("MongoDb:Password").Value;
                 options.Host = Configuration.GetSection("MongoDb:Host").Value;
                 options.Port = Configuration.GetSection("MongoDb:Port").Value;
                 options.Container = Configuration.GetSection("MongoDb:Container").Value;
                 options.IsContained = Configuration["DOTNET_RUNNING_IN_CONTAINER"] != null;
             });

          
            services.AddTransient<IDbContext, DbContext>();


            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins,
                builder =>
                {
                    builder.WithOrigins("*")
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                });
            });


            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors(MyAllowSpecificOrigins);

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
