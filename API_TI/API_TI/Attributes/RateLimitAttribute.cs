namespace API_TI.Attributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class RateLimitAttribute : Attribute
    {
        public int MaxRequests { get; set; }
        public int WindowSeconds { get; set; }

        public RateLimitAttribute(int maxRequests = 100, int windowSeconds = 60)
        {
            MaxRequests = maxRequests;
            WindowSeconds = windowSeconds;
        }
    }
}
