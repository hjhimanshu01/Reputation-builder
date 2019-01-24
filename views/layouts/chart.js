data = {
    datasets: [{
        data: [10, 20, 30],
        
        backgroundColor: ["#0074D9", "#FF4136", "#2ECC40"],
        innerRadius: 9  ,
        animationEnabled: true,
        
            }],
            
    labels: [
        'Red',
        'Yellow',
        'Blue'
            ]} ,
            
        
            
 myPieChart = new Chart(ctx,{
    type: 'doughnut',
    data: data,
    });


    data = {
        datasets: [{
            data: [10, 20, 30],
            backgroundColor: ["#0074D9", "#FF4136", "#2ECC40"]
                }],
                
        labels: [
            'Red',
            'Yellow',
            'Blue'
                ]} ,
                
            
                
     myPieChart = new Chart(ctx1,{
        type: 'bar',
        data: data,
        });
    