# Banking API - Quick Test Commands

## PowerShell Commands

### 1. Test Compliance Balance

```powershell
$body = '{"shipId":"SHIP001","year":2024}'
Invoke-RestMethod -Uri "http://localhost:5000/api/compliance/cb" -Method POST -Body $body -ContentType "application/json"
```

### 2. Test Bank Surplus

```powershell
$body = '{"shipId":"SHIP001","year":2024,"amount":15.5}'
Invoke-RestMethod -Uri "http://localhost:5000/api/banking/bank" -Method POST -Body $body -ContentType "application/json"
```

### 3. Test Apply Surplus

```powershell
$body = '{"shipId":"SHIP001","year":2024,"amount":10.0}'
Invoke-RestMethod -Uri "http://localhost:5000/api/banking/apply" -Method POST -Body $body -ContentType "application/json"
```

### 4. Test Get Records

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/banking/records?shipId=SHIP001"
```

---

## cURL Commands (if you have curl installed)

### 1. Get Compliance Balance

```bash
curl -X POST http://localhost:5000/api/compliance/cb \
  -H "Content-Type: application/json" \
  -d '{"shipId":"SHIP001","year":2024}'
```

### 2. Bank Surplus

```bash
curl -X POST http://localhost:5000/api/banking/bank \
  -H "Content-Type: application/json" \
  -d '{"shipId":"SHIP001","year":2024,"amount":15.5}'
```

### 3. Apply Surplus

```bash
curl -X POST http://localhost:5000/api/banking/apply \
  -H "Content-Type: application/json" \
  -d '{"shipId":"SHIP001","year":2024,"amount":10.0}'
```

### 4. Get Records

```bash
curl http://localhost:5000/api/banking/records?shipId=SHIP001
```

---

## Expected Responses

### 1. Compliance Balance Response

```json
{
  "success": true,
  "data": {
    "cbValue": 15.5,
    "shipId": "SHIP001",
    "year": 2024
  }
}
```

### 2. Bank Surplus Response

```json
{
  "success": true,
  "data": {
    "cbBefore": 15.5,
    "applied": 15.5,
    "cbAfter": 0.0
  }
}
```

### 3. Apply Surplus Response

```json
{
  "success": true,
  "data": {
    "cbBefore": -5.0,
    "applied": 10.0,
    "cbAfter": 5.0
  }
}
```

### 4. Records Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "shipId": "SHIP001",
      "action": "bank",
      "amount": 15.5,
      "cbBefore": 15.5,
      "cbAfter": 0.0,
      "timestamp": "2024-11-08T10:00:00.000Z"
    }
  ]
}
```

---

## Run Full Test Suite

Execute the PowerShell test script:

```powershell
.\test-banking-api.ps1
```

This will run all 4 endpoints in sequence and show colored output for success/failure.
