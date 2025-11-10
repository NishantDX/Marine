# Backend Banking API - Test Script
# Run these commands in PowerShell to test your backend endpoints

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "FuelEU Banking API Test Suite" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Get Compliance Balance
Write-Host "Test 1: GET Compliance Balance" -ForegroundColor Yellow
Write-Host "POST http://localhost:5000/api/compliance/cb" -ForegroundColor Gray

$body1 = @{
    shipId = "SHIP001"
    year = 2024
} | ConvertTo-Json

try {
    $result1 = Invoke-RestMethod -Uri "http://localhost:5000/api/compliance/cb" `
        -Method POST `
        -Body $body1 `
        -ContentType "application/json"
    
    Write-Host "✓ Success!" -ForegroundColor Green
    $result1 | ConvertTo-Json -Depth 5
} catch {
    Write-Host "✗ Failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "--------------------------------------------------" -ForegroundColor Gray
Write-Host ""

# Test 2: Bank Surplus
Write-Host "Test 2: Bank Positive Surplus" -ForegroundColor Yellow
Write-Host "POST http://localhost:5000/api/banking/bank" -ForegroundColor Gray

$body2 = @{
    shipId = "SHIP001"
    year = 2024
    amount = 15.5
} | ConvertTo-Json

try {
    $result2 = Invoke-RestMethod -Uri "http://localhost:5000/api/banking/bank" `
        -Method POST `
        -Body $body2 `
        -ContentType "application/json"
    
    Write-Host "✓ Success!" -ForegroundColor Green
    $result2 | ConvertTo-Json -Depth 5
} catch {
    Write-Host "✗ Failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "--------------------------------------------------" -ForegroundColor Gray
Write-Host ""

# Test 3: Apply Surplus
Write-Host "Test 3: Apply Banked Surplus" -ForegroundColor Yellow
Write-Host "POST http://localhost:5000/api/banking/apply" -ForegroundColor Gray

$body3 = @{
    shipId = "SHIP001"
    year = 2024
    amount = 10.0
} | ConvertTo-Json

try {
    $result3 = Invoke-RestMethod -Uri "http://localhost:5000/api/banking/apply" `
        -Method POST `
        -Body $body3 `
        -ContentType "application/json"
    
    Write-Host "✓ Success!" -ForegroundColor Green
    $result3 | ConvertTo-Json -Depth 5
} catch {
    Write-Host "✗ Failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "--------------------------------------------------" -ForegroundColor Gray
Write-Host ""

# Test 4: Get Records
Write-Host "Test 4: Get Transaction History" -ForegroundColor Yellow
Write-Host "GET http://localhost:5000/api/banking/records?shipId=SHIP001" -ForegroundColor Gray

try {
    $result4 = Invoke-RestMethod -Uri "http://localhost:5000/api/banking/records?shipId=SHIP001" `
        -Method GET
    
    Write-Host "✓ Success!" -ForegroundColor Green
    $result4 | ConvertTo-Json -Depth 5
} catch {
    Write-Host "✗ Failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Test Suite Complete" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
