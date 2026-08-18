export var EmailStatus
;(function (EmailStatus) {
    EmailStatus['Bounced'] = 'BOUNCED'
    EmailStatus['Complained'] = 'COMPLAINED'
    EmailStatus['Delivered'] = 'DELIVERED'
    EmailStatus['Failed'] = 'FAILED'
    EmailStatus['Queued'] = 'QUEUED'
    EmailStatus['Sent'] = 'SENT'
})(EmailStatus || (EmailStatus = {}))
export var JobStatus
;(function (JobStatus) {
    JobStatus['Failed'] = 'FAILED'
    JobStatus['Pending'] = 'PENDING'
    JobStatus['Running'] = 'RUNNING'
    JobStatus['Succeeded'] = 'SUCCEEDED'
})(JobStatus || (JobStatus = {}))
export var Role
;(function (Role) {
    Role['Admin'] = 'ADMIN'
    Role['User'] = 'USER'
})(Role || (Role = {}))
export var ScrapeStatus
;(function (ScrapeStatus) {
    ScrapeStatus['Failed'] = 'FAILED'
    ScrapeStatus['Ok'] = 'OK'
    ScrapeStatus['Rejected'] = 'REJECTED'
})(ScrapeStatus || (ScrapeStatus = {}))
