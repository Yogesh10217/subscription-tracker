import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name:{
    type:String, 
    required:[true,'Subscription Name is required'],
    trim: true,
    minLength:2,
    maxLength:100,
  },
  price:{
    type:Number,
    required:[true,'Price is required'],  
    min:[0,'Price must be positive number'],
    max:[1000,'Price must be greater than 0']
  },
  currency:{
    type:String,
    enum:['USD','INR','EUR'],
    default:'USD'
  },
  frequency:{
    type:String,
    enum:['Daily','Weekly','Monthly','Yearly'],
  },
  category:{
    type:String,
    enum:['Entertainment','Education','Productivity','Health','Other'],
    required:[true,'Category is required']
  },
  paymentMethod:{
    type:String,
    required:[true,'Payment Method is required'],
    trim:true,
  },
  status:{
    type:String,
    enum:['Active','expired','Cancelled'],
    default:'Active'
  },
  startDate:{
    type:Date,
    required:[true,'Start Date is required'],
    vaildate :{
      validator: (value)=> value <= new Date(),
      message: 'Start Date cannot be in the future',
    }
  },
  renewalDate:{
    type:Date,
    validate:{
      validator: function(value){
        return  value > this.startDate
      },
      message: 'Renewal Date must be after Start Date',
    }
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
    index:true,
  }
      
},{timestamps:true});

//Auto-calculate reneval date if missing
subscriptionSchema.pre('save', function(next){
  if(!this.renewalDate){
    const renewalPeriods={
      'Daily':1,
      'Weekly':7,
      'Monthly':30,
      'Yearly':365,
    };
    this.renewalDate=new Date(this.startDate);
    this.renewalDatt.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }
  //Auto-update status if renewal date has passed
  if(this.renewalDate && this.renewalDate < new Date()){
    this.status='expired';
  }
  next();
});

const Subscription = mongoose.model('Subscription',subscriptionSchema);

export default Subscription;