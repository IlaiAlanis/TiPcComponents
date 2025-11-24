namespace API_TI.Models.DTOs.AdminDTOs
{
    public class DashboardMetricsDto
    {
        public decimal TotalSales { get; set; }
        public decimal SalesToday { get; set; }
        public decimal SalesLast7Days { get; set; }
        public decimal SalesLast30Days { get; set; }

        public int TotalOrders { get; set; }
        public int OrdersToday { get; set; }
        public int PendingOrders { get; set; }
        public int CompletedOrders { get; set; }

        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int NewUsersToday { get; set; }
        public int NewUsersLast7Days { get; set; }

        public int TotalProducts { get; set; }
        public int LowStockProducts { get; set; }
        public int OutOfStockProducts { get; set; }

        public List<TopProductDto> TopSellingProducts { get; set; }
        public List<DailyRevenueDto> RevenueTrend { get; set; }
    }
}
