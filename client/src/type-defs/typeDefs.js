"use strict";
exports.__esModule = true;
exports.PaymentMethods = exports.States = void 0;
//export type States = 'NJ' | 'PA';
exports.States = ['NJ', 'PA'];
//export enum States {NJ, PA};
exports.PaymentMethods = ['Cash', 'CashApp', 'Venmo', 'Paypal', 'Zelle', 'Other'];
/**	Customer table fields from SQL-based Little Store web app
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", length=10, nullable=false, unique=true)
    private int id;
    
    @Basic(optional=false)
    @Column(name="email", length=50, nullable=false, unique=true)
    private String email;
    
    @Basic(optional=false)
    @Column(name="password", length=60, nullable=false)
    private String password;
    
    @Transient
    private String passwordConfirm;

    @Basic(optional=false)
    @Column(name="firstName", length=50, nullable=false)
    private String firstName;

    @Basic(optional=false)
    @Column(name="lastName", length=50, nullable=false)
    private String lastName;

    @Basic
    @Column(name="phone", length=10, nullable=true)
    private String phone;

    @Basic
    @Column(name="address", length=50, nullable=true)
    private String address;

    @Basic
    @Column(name="city", length=50, nullable=true)
    private String city;

    @Basic
    @Column(name="state", nullable=true)
    private States state;									// 'NJ','PA'
    
    @Basic
    @Column(name="preferredPayment", nullable=true)
    private PaymentMethods preferredPayment;				// 'Cash','Cash App','Venmo','Paypal','Zelle','Other'

    @Basic
    @Column(name="paymentHandle", length=50, nullable=true)
    private String paymentHandle;							// Name/ID on Preferred Payment Platform

    @Basic
    @Column(name="isEnabled", nullable=false, columnDefinition="boolean default true")	// Set to false if user account is deleted or disabled by admin
    private Boolean isEnabled;
    
    // @ManyToMany
    // @JoinTable(name = "customer_role",
    // 	joinColumns = @JoinColumn(name = "customerId", referencedColumnName = "id"),
    // 	inverseJoinColumns = @JoinColumn(name = "roleId", referencedColumnName = "id"))
    @ManyToMany
    private Set<Role> role;
*/ 
